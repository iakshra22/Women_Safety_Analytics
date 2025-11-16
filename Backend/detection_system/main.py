import cv2
from frame_processor import FrameProcessor
from violence_detector import ViolenceDetector
from alert_system import AlertSystem

class CameraStream:
    def __init__(self, camera_source=0):
        self.camera_source = camera_source
        self.cap = cv2.VideoCapture(camera_source)
        if not self.cap.isOpened():
            raise ValueError(f"Cannot open camera: {camera_source}")

    def get_frame(self):
        ret, frame = self.cap.read()
        if not ret:
            return None
        return frame

    def release(self):
        self.cap.release()
        cv2.destroyAllWindows()

def main():
    CAMERA_SOURCE = 0 
    cam = CameraStream(CAMERA_SOURCE)
    detector = ViolenceDetector()
    alert = AlertSystem()

    print("Detection started... Press Q to quit")

    while True:
        frame = cam.get_frame()
        if frame is None:
            print("Camera not available or disconnected.")
            break

        processed = FrameProcessor.preprocess(frame)
        prob = detector.predict(processed)

        if prob > 0.5:
            cv2.putText(frame, "VIOLENCE DETECTED!", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 3)
            alert.trigger_alert()
        else:
            cv2.putText(frame, "Normal", (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

        cv2.imshow("Live Detection", frame)

        if cv2.waitKey(1) & 0xFF == ord("q"):
            break

    cam.release()

if __name__ == "__main__":
    main()
