class DomainInfo:
    """A class to encapsulate information about a libvirt domain."""
    
    # Domain state mapping based on libvirt's virDomainState
    DOMAIN_STATES = {
        0: "No state",
        1: "Running",
        2: "Blocked",
        3: "Paused",
        4: "Shutdown",
        5: "Shut off",
        6: "Crashed",
        7: "PMSuspended"
    }

    def __init__(self, domain, stats):
        """Initialize DomainInfo with a virDomain object and its stats."""
        self._domain = domain
        self._stats = stats

        # Core domain attributes
        self.state = self.DOMAIN_STATES.get(stats.get("state.state", 0), "Unknown")
        self.state_reason = stats.get("state.reason", 0)
        self.cpu_time = stats.get("cpu.time", 0)
        self.cpu_user = stats.get("cpu.user", 0)
        self.cpu_system = stats.get("cpu.system", 0)
        self.balloon_current = stats.get("balloon.current", 0)
        self.balloon_maximum = stats.get("balloon.maximum", 0)
        self.vcpu_current = stats.get("vcpu.current", 0)
        self.vcpu_maximum = stats.get("vcpu.maximum", 0)
        self.block_count = stats.get("block.count", 0)

        # Block device attributes (stored as dictionaries in a list)
        self.block_devices = []
        for i in range(self.block_count):
            block_prefix = f"block.{i}."
            block_info = {
                "name": stats.get(f"{block_prefix}name"),
                "path": stats.get(f"{block_prefix}path"),
                "allocation": stats.get(f"{block_prefix}allocation"),
                "capacity": stats.get(f"{block_prefix}capacity"),
                "physical": stats.get(f"{block_prefix}physical")
            }
            self.block_devices.append(block_info)

    def domain(self):
        """Get the underlying virDomain object."""
        return self._domain

    def name(self):
        """Get the domain name."""
        return self._domain.name()

    def __str__(self):
        """String representation of the DomainInfo."""
        block_info = "\n".join(
            f"    Block Device {i}: Name: {bd['name']}, Path: {bd['path']}, "
            f"Allocation: {bd['allocation']} bytes, Capacity: {bd['capacity']} bytes, "
            f"Physical: {bd['physical']} bytes"
            for i, bd in enumerate(self.block_devices)
        )
        return (f"Domain: {self.name}\n"
                f"State: {self.state} (Reason: {self.state_reason})\n"
                f"CPU Time: {self.cpu_time} ns (User: {self.cpu_user} ns, System: {self.cpu_system} ns)\n"
                f"Balloon: Current {self.balloon_current} KB, Maximum {self.balloon_maximum} KB\n"
                f"VCPUs: Current {self.vcpu_current}, Maximum {self.vcpu_maximum}\n"
                f"Block Devices ({self.block_count}):\n{block_info}")

    def to_dict(self):
        """Return a JSON-serializable dictionary of the domain info."""
        return {
            "name": self.name(),
            "state": self.state,
            "state_reason": self.state_reason,
            "cpu": {
                "time": self.cpu_time,
                "user": self.cpu_user,
                "system": self.cpu_system,
            },
            "balloon": {
                "current": self.balloon_current,
                "maximum": self.balloon_maximum,
            },
            "vcpu": {
                "current": self.vcpu_current,
                "maximum": self.vcpu_maximum,
            },
            "block_devices": self.block_devices,
        }
