import cv2

class CameraStream:
    def __init__(self, url):
        self.url = url
        self.cap = cv2.VideoCapture(url)

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None
        return frame

    def release(self):
        self.cap.release()
        cv2.destroyAllWindows()
