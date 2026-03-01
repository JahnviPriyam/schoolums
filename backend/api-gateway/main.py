from fastapi import FastAPI, Request, Response
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# ==========================
# CORS
# ==========================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

AUTH_SERVICE_URL = "http://auth-service:8000"
STUDENT_SERVICE_URL = "http://student-service:8001"


# ==========================
# Forward Request Helper
# ==========================
async def forward_request(request: Request, target_url: str):
    async with httpx.AsyncClient() as client:
        body = await request.body()
        headers = dict(request.headers)

        response = await client.request(
            request.method,
            target_url,
            content=body,
            headers=headers
        )

        return Response(
            content=response.content,
            status_code=response.status_code,
            headers=dict(response.headers),
        )


# ==========================
# AUTH PROXY
# ==========================
@app.api_route(
    "/auth/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def auth_proxy(path: str, request: Request):
    return await forward_request(
        request,
        f"{AUTH_SERVICE_URL}/{path}"
    )


# ==========================
# STUDENT ROOT (/students)
# ==========================
@app.api_route(
    "/students",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def student_root_proxy(request: Request):
    return await forward_request(
        request,
        f"{STUDENT_SERVICE_URL}/students"
    )


# ==========================
# STUDENT SUBPATH (/students/anything)
# ==========================
@app.api_route(
    "/students/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def student_proxy(path: str, request: Request):
    return await forward_request(
        request,
        f"{STUDENT_SERVICE_URL}/students/{path}"
    )