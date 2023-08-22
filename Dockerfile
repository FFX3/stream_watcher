FROM node:latest

# Create app directory
WORKDIR /usr/src/app
RUN apt update
RUN apt install wget
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install -y ./google-chrome-stable_current_amd64.deb
RUN apt install -y curl unzip xvfb libxi6 libgconf-2-4
RUN apt install ffmpeg libsm6 libxext6 -y
#RUN apt install -y libglib2.0-0 \
#    libnss3 \
#    libgconf-2-4 \
#    libfontconfig1
#RUN pip install opencv-python opencv-python-headless psycopg2-binary selenium schedule supabase python-dotenv
COPY . .
RUN npm i

CMD [ "node", "index.js" ]
