import subprocess
import tempfile
import os
import uuid

LANGUAGE_CONFIG = {
    'python': {
        'image': 'python:3.10-slim',
        'file': 'script.py',
        'cmd': 'python script.py'
    },
    'cpp': {
        'image': 'gcc:12.2.0',
        'file': 'main.cpp',
        'cmd': 'sh -c "g++ main.cpp -o main && ./main"'
    },
    'javascript': {
        'image': 'node:20-slim',
        'file': 'script.js',
        'cmd': 'node script.js'
    },
    'java': {
        'image': 'openjdk:21-slim',
        'file': 'Main.java',
        'cmd': 'sh -c "javac Main.java && java Main"'
    }
}

def run_code(code: str, language: str, input_data: str = None) -> dict:
    if language not in LANGUAGE_CONFIG:
        return {'error': f'Unsupported language: {language}'}
    config = LANGUAGE_CONFIG[language]
    with tempfile.TemporaryDirectory() as tmpdir:
        code_path = os.path.join(tmpdir, config['file'])
        with open(code_path, 'w', encoding='utf-8') as f:
            f.write(code)
        container_name = f"runner_{uuid.uuid4().hex}"
        try:
            result = subprocess.run(
                [
                    'docker', 'run', '-i', '--rm',
                    '--name', container_name,
                    '--memory', '128m', '--cpus', '0.5',
                    '-v', f'{tmpdir}:/workspace',
                    '-w', '/workspace',
                    config['image'],
                    '/bin/sh', '-c', config['cmd']
                ],
                input=input_data.encode('utf-8') if input_data else None,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                timeout=60 
            )
            raw_stderr = result.stderr.decode('utf-8')
            # Filter out Docker noise from stderr
            docker_noise = [
                'Unable to find image',
                'Pulling fs layer',
                'Download complete',
                'Digest:',
                'Status: Downloaded newer image for',
                'Status: Image is up to date for',
                'latest: Pulling from',
                'Pull complete',
                'Pulling from',
                'pull',
                'Downloading',
                'Extracting',
                'Verifying Checksum',
                'Waiting',
                'Writing manifest',
                'Storing signatures',
            ]
            filtered_stderr = '\n'.join(
                line for line in raw_stderr.splitlines()
                if not any(noise.lower() in line.lower() for noise in docker_noise)
            )
            return {
                'stdout': result.stdout.decode('utf-8'),
                'stderr': filtered_stderr,
                'exit_code': result.returncode
            }
        except subprocess.TimeoutExpired:
            return {'stdout': '', 'stderr': 'Execution timed out.', 'exit_code': -1}
        except Exception as e:
            return {'stdout': '', 'stderr': str(e), 'exit_code': -1}
