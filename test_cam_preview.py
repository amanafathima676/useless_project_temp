"""
Quick Standalone Webcam Live Test & Calibration
Run with:
    python test_cam_preview.py
"""
import cv2

print("Opening webcam live preview... (Press 'q' to close)")
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
if not cap.isOpened():
    cap = cv2.VideoCapture(0)

cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)

while True:
    ret, frame = cap.read()
    if not ret or frame is None:
        print("Waiting for camera frame...")
        continue

    frame = cv2.flip(frame, 1)
    cv2.putText(frame, "LIVE CAMERA TEST - Press Q to Exit", (20, 40),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)
    cv2.imshow("Webcam Calibration", frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
