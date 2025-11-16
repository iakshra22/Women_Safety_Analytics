import cv2

class FrameProcessor:
    @staticmethod
    def preprocess(frame):
        frame = cv2.resize(frame, (224, 224))  # Same size as model input
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        frame = frame / 255.0
        return frame