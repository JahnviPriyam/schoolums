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
EXAM_SERVICE_URL = "http://exam-service:8002"
TIMETABLE_SERVICE_URL = "http://timetable-service:8003"


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
    query_string = request.url.query
    url = f"{AUTH_SERVICE_URL}/{path}"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)


# ==========================
# STUDENT ROOT (/students)
# ==========================
@app.api_route(
    "/students",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def student_root_proxy(request: Request):
    query_string = request.url.query
    url = f"{STUDENT_SERVICE_URL}/students"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)


# ==========================
# STUDENT SUBPATH (/students/anything)
# ==========================
@app.api_route(
    "/students/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def student_proxy(path: str, request: Request):
    query_string = request.url.query
    url = f"{STUDENT_SERVICE_URL}/students/{path}"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

@app.api_route(
    "/attendance",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def attendance_root_proxy(request: Request):
    query_string = request.url.query
    url = f"{STUDENT_SERVICE_URL}/attendance"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)


@app.api_route(
    "/attendance/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def attendance_proxy(path: str, request: Request):
    query_string = request.url.query
    url = f"{STUDENT_SERVICE_URL}/attendance/{path}"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

# ==========================
# EXAM ROUTES
# ==========================
@app.api_route(
    "/exams",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def exam_root_proxy(request: Request):
    # Pass query params if any
    query_string = request.url.query
    url = f"{EXAM_SERVICE_URL}/exams"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

@app.api_route(
    "/exams/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def exam_proxy(path: str, request: Request):
    query_string = request.url.query
    url = f"{EXAM_SERVICE_URL}/exams/{path}"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

@app.api_route(
    "/marks",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def marks_root_proxy(request: Request):
    query_string = request.url.query
    url = f"{EXAM_SERVICE_URL}/marks"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

@app.api_route(
    "/marks/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def marks_proxy(path: str, request: Request):
    query_string = request.url.query
    url = f"{EXAM_SERVICE_URL}/marks/{path}"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

# ==========================
# TIMETABLE ROUTES
# ==========================
@app.api_route(
    "/timetable",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def timetable_root_proxy(request: Request):
    query_string = request.url.query
    url = f"{TIMETABLE_SERVICE_URL}/timetable"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)

@app.api_route(
    "/timetable/{path:path}",
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
)
async def timetable_proxy(path: str, request: Request):
    query_string = request.url.query
    url = f"{TIMETABLE_SERVICE_URL}/timetable/{path}"
    if query_string:
        url += f"?{query_string}"
    return await forward_request(request, url)