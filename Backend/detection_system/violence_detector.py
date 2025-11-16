import numpy as np
import tensorflow as tf

class ViolenceDetector:
    def __init__(self):
        self.interpreter = tf.lite.Interpreter(
            model_path="violence_detection.tflite"
        )
        self.interpreter.allocate_tensors()
        self.input_details = self.interpreter.get_input_details()
        self.output_details = self.interpreter.get_output_details()

    def predict(self, frame):
        frame = np.expand_dims(frame, axis=0).astype("float32")
        self.interpreter.set_tensor(self.input_details[0]['index'], frame)
        self.interpreter.invoke()
        output = self.interpreter.get_tensor(self.output_details[0]['index'])[0]
        return float(output[0])