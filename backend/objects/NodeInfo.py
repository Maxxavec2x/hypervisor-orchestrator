class NodeInfo:
    def __init__(self, info_list):
        """
        Initialise l'objet NodeInfo à partir de la liste renvoyée par libvirt.getInfo().
        
        Paramètres :
            info_list : list - Doit contenir exactement 8 éléments dans cet ordre :
                [model, memory_mb, cpus, mhz, numa_nodes, sockets, cores_per_socket, threads_per_core]
        """
        if len(info_list) != 8:
            raise ValueError("La liste info_list doit contenir exactement 8 éléments.")
        
        self.model = info_list[0]                  # ex: 'x86_64'
        self.memory_mb = info_list[1]              # en MB
        self.cpus = info_list[2]                   # nombre total de vCPUs
        self.mhz = info_list[3]                    # fréquence en MHz
        self.numa_nodes = info_list[4]             # nombre de nœuds NUMA
        self.sockets = info_list[5]                # nombre de sockets
        self.cores_per_socket = info_list[6]       # cœurs par socket
        self.threads_per_core = info_list[7]       # threads par cœur (SMT)

    def __str__(self):
        """Retourne une représentation formatée comme dans ton print original."""
        return (
            "Model: {}\n"
            "Memory size: {} MB\n"
            "Number of CPUs: {}\n"
            "MHz of CPUs: {}\n"
            "Number of NUMA nodes: {}\n"
            "Number of CPU sockets: {}\n"
            "Number of CPU cores per socket: {}\n"
            "Number of CPU threads per core: {}".format(
                self.model,
                self.memory_mb,
                self.cpus,
                self.mhz,
                self.numa_nodes,
                self.sockets,
                self.cores_per_socket,
                self.threads_per_core
            )
        )

    def __repr__(self):
        return (f"NodeInfo(model={self.model!r}, memory_mb={self.memory_mb}, cpus={self.cpus}, "
                f"mhz={self.mhz}, numa_nodes={self.numa_nodes}, sockets={self.sockets}, "
                f"cores_per_socket={self.cores_per_socket}, threads_per_core={self.threads_per_core})")
