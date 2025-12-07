# Hypervisor-Orchestrator

## About the Project
This project enables the management of virtual machines through a web interface. Virtual machines can be installed locally or on a remote machine.

## Video
https://github.com/user-attachments/assets/7380e7c2-8a23-4c3b-ad9b-e71d88f1b198
### Available Features
| Feature |
|---------|
| VM creation |
| VM shutdown |
| VM deletion |
| Viewing and interacting with a VM via a screen visualization tab |
| Accessing VM status information (VM name, hardware configuration, operational status) |
| Accessing host machine status information |
| Adding a new host machine |

### Technical Stack
- Virtual machine management: [libvirt](https://libvirt.org/)
- Backend: [Python Flask](https://flask.palletsprojects.com/en/stable/)
- Frontend: [React](https://react.dev/)

---

## Running the Project

### Requirements
You need SSH key access to all the hypervisors you want to orchestrate (including localhost).
To set up SSH key access to a remote hypervisor, use:
```bash
ssh-copy-id <user@hypervisorIp>
```
For example:
```bash
ssh-copy-id localhost
```
If you don’t have an SSH key, generate one using:
```bash
ssh-keygen
```

---

### Backend Setup

#### 1. Install Required Packages
```bash
sudo apt install qemu-kvm libvirt-clients libvirt-daemon-system virtinst libvirt-daemon libvirt-dev
```

#### 2. Activate libvirt
Edit `/etc/default/libvirtd` and set `start_libvirtd` to `yes`, then restart the libvirt daemon:
```bash
sudo /etc/init.d/libvirtd restart
```

#### 3. Create a Storage Pool
```bash
virsh -c qemu:///system pool-define-as --name default --type dir --target /path/to/store/disk
sudo chgrp libvirt /path/to/store/disk
virsh -c qemu:///system pool-start default
```

#### 4. Install websockify
Install [websockify](https://github.com/novnc/websockify) to view VM screens in your browser.

#### 5. Install Python Dependencies
Ensure `pip` is installed for your Python version:
```bash
sudo apt install python3.13-venv python3-pip
```

#### 6. Start the Backend
Run the script:
```bash
./backend/start_backend.sh
```

---

### Frontend Setup

You have three options to start the frontend:

#### 1. (Recommended) Use the Docker Image
```bash
docker run -p 3000:3000 ghcr.io/maxxavec2x/hypervisor-orchestrator-front
```

#### 2. Run Locally with Node.js
Ensure `npm` is installed, then run:
```bash
./frontend/hypervisor-orchestrator-hmi/start_frontend.sh
```

#### 3. Build the Docker Image Yourself
Use the Dockerfile located at:
```
./frontend/hypervisor-orchestrator-hmi/Dockerfile
```

The web interface will be available at [localhost:3000](http://localhost:3000) in your browser.

## Side note
`exo1.c` is not part of the project. It is simply a file containing exercise solutions.
