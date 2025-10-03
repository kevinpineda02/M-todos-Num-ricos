import yt_dlp

# URL del video de YouTube
video_url = "https://www.youtube.com/watch?v=eZyBaI5tl9w"

# Opciones para descargar solo video 1080p sin audio
ydl_opts = {
    # Elegimos el mejor video hasta 1080p, sin audio
    'format': 'bestvideo[height<=1080]',
    
    # Descargar solo la sección de 0 a 60 segundos
    'download_sections': {
        '*': [
            {
                'start_time': 0,   # inicio en segundos
                'end_time': 60     # fin en segundos
            }
        ]
    },
    
    # Nombre del archivo de salida
    'outtmpl': 'primer_minuto_1080p_sin_audio.%(ext)s',
    
    # Mostrar progreso en consola
    'progress_hooks': [lambda d: print(d['status'], d.get('filename', ''))],
}

# Ejecutamos la descarga
with yt_dlp.YoutubeDL(ydl_opts) as ydl:
    ydl.download([video_url])
