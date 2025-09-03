FROM python:3.9
WORKDIR /code
COPY ./requirements.txt /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
COPY ./main.py /code
CMD ["fastapi", "run", "main.py", "--port", "80"]

# First build the backend
# docker build -t fastapi-backend-img .

# Then run the backend
# docker run -d --name fastapi-container -p 80:80 fastapi-backend-img

# https://fastapi.tiangolo.com/deployment/docker/#one-process-per-container