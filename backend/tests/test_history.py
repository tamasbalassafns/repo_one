import pytest
from fastapi.testclient import TestClient
from sqlmodel import SQLModel, Session, create_engine
from sqlmodel.pool import StaticPool
from app.main import app
from app.database import get_session


@pytest.fixture(name="session")
def session_fixture():
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)
    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    def override_get_session():
        yield session

    app.dependency_overrides[get_session] = override_get_session
    client = TestClient(app)
    yield client
    app.dependency_overrides.clear()


def test_list_history_empty(client: TestClient):
    response = client.get("/history")
    assert response.status_code == 200
    assert response.json() == []


def test_create_entry(client: TestClient):
    response = client.post("/history", json={"expression": "2 + 2", "result": "4"})
    assert response.status_code == 201
    data = response.json()
    assert data["expression"] == "2 + 2"
    assert data["result"] == "4"
    assert "id" in data


def test_list_history_newest_first(client: TestClient):
    client.post("/history", json={"expression": "1 + 1", "result": "2"})
    client.post("/history", json={"expression": "3 × 3", "result": "9"})
    response = client.get("/history")
    entries = response.json()
    assert len(entries) == 2
    assert entries[0]["expression"] == "3 × 3"


def test_delete_entry(client: TestClient):
    create_resp = client.post("/history", json={"expression": "5 - 2", "result": "3"})
    entry_id = create_resp.json()["id"]
    delete_resp = client.delete(f"/history/{entry_id}")
    assert delete_resp.status_code == 204
    assert client.get("/history").json() == []


def test_delete_nonexistent_entry(client: TestClient):
    response = client.delete("/history/999")
    assert response.status_code == 404
