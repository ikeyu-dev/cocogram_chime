import time
import pygame


audio_file = "/Users/uyuyu/02.code/cocogram/src/media/チャイム.mp3"

# 再生する時刻を設定
target_hour = 11
target_minute = 45

while True:
    # 現在時刻取得
    now = time.localtime()
    current_hour = now.tm_hour
    current_minute = now.tm_min

    # 時刻になったら音声を再生
    if current_hour == target_hour and current_minute == target_minute:
        pygame.mixer.init()
        pygame.mixer.music.load(audio_file)
        pygame.mixer.music.play()
        while pygame.mixer.music.get_busy():
            time.sleep(1)
        break

    time.sleep(1)
