import mediapipe as mp

class PoseDetector:
    def __init__(self):
        self.pose = mp.solutions.pose.Pose()

    def detect(self, frame):
        rgb = frame[:, :, ::-1]
        result = self.pose.process(rgb)
        return result.pose_landmarks
