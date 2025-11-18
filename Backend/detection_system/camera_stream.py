import cv2

class CameraStream:
    def __init__(self, url):
        self.url = url
        self.cap = cv2.VideoCapture(http://10.172.160.23:8080/video)

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None
        return frame

    def release(self):
        self.cap.release()
        cv2.destroyAllWindows()

