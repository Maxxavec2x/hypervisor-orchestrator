# hypervisor-orchestrator

## About the project :



## Running the project:

### Requirement :

You need to have an ssh key access to all the hypervisors you want to orchestrate. (Even localhost)</br>
To get ssh key access to a distant hypervisor, please use `ssh-copy-id <user@hypervisorIp>`. For example, `ssh-copy-id localhost`.
#### Dependencies: 
To run the backend, you need to have installed :
- websockify (https://github.com/novnc/websockify)<br/>
If you use Arch (btw), you can download it from the AUR : `yay -S websockify`.
- python-pip 

### Backend: 

To start the backend, just start the `./backend/start_backend.sh` script.

### Frontend

To start the frontend, you have three choices:

1. (Suggested) : Use the docker image that we publish in the package section of github. To do this, use `docker run -p 3000:3000 ghcr.io/maxxavec2x/hypervisor-orchestrator-front`
2. Install the latest node package, and run the ./frontend/hypervisor-orchestrator-hmi/start_frontend.sh. It will install all the dependencies in your machine, and start the developpement webserver.<br>

The web interface will be then available at `localhost:3000` in your favorite browser.

