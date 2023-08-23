import cv2
import sys

# RTSP link
rtsp_link = sys.argv[1]

# Capture the video stream
cap = cv2.VideoCapture(rtsp_link)

# Check if the stream is opened successfully
if cap.isOpened():
    ret, frame = cap.read()
    if ret:
        # cv2.imwrite('screenshot.jpg', frame)
        print("online")
    else:
        print("Failed to read frame from stream.")
else:
    print("Failed to open stream.")

cap.release()