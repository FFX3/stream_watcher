FROM nikolaik/python-nodejs:latest

# Create app directory
WORKDIR /usr/src/app
RUN apt update && apt install ffmpeg libsm6 libxext6 -y
RUN apt install wget
RUN wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
RUN apt install -y ./google-chrome-stable_current_amd64.deb
RUN apt install -y curl unzip xvfb libxi6 libgconf-2-4
RUN apt install -y libglib2.0-0 \
    libnss3 \
    libgconf-2-4 \
    libfontconfig1
RUN pip install opencv-python opencv-python-headless psycopg2-binary selenium schedule
# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "server.js" ]