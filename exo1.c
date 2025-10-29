/* compile with: gcc -g -Wall exo1.c -o exo1 -lvirt */
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <libvirt/libvirt.h>

int main(int argc, char *argv[])
{
	virDomainPtr domainToRestart = malloc(sizeof(virDomainPtr));

	/* EXERCICE 1*/
	virConnectPtr conn = virConnectOpenAuth("qemu+ssh://user@172.19.3.20/system", virConnectAuthPtrDefault, 0);
	if (conn == NULL) {
		fprintf(stderr, "Failed to open connection to qemu+tcp://localhost/system\n");
		return 1;
	}
	printf("Connection successful :)");

	/* EXERCICE 2 */
	char *host;
        host = virConnectGetHostname(conn);
        fprintf(stdout, "Hostname:%s\n", host);
        free(host);

	int vcpus;
	vcpus = virConnectGetMaxVcpus(conn, NULL);
	fprintf(stdout, "Maximum support virtual CPUs: %d\n", vcpus);

	unsigned long long node_free_memory;
	node_free_memory = virNodeGetFreeMemory(conn);
	fprintf(stdout, "Memory size: %llu\n", node_free_memory);

	/* EXERCICE 3*/
	virDomainPtr *domains;
	unsigned int flags = VIR_CONNECT_LIST_DOMAINS_ACTIVE ;
	int ret = virConnectListAllDomains(conn, &domains, flags);
	domainToRestart = domains[0];
	printf("Active domain IDs:\n");
	virDomainInfoPtr domainInfo = malloc(sizeof(virDomainInfoPtr));
	for (int i=0; i<ret;i++){
		virDomainGetInfo(domains[i], domainInfo);
		printf("\tid: %d, nom: %s\n",virDomainGetID(domains[i]), virDomainGetName(domains[i]));
		printf("\t\tstate: %d\n", domainInfo->state);
        printf("\t\tmaxMem: %lu\n", domainInfo->maxMem);
		printf("\t\tmemory: %lu\n", domainInfo->memory);
		printf("\t\tnrVirtCpu: %d\n", domainInfo->nrVirtCpu);
		printf("\t\tcpuTime: %llu\n", domainInfo->cpuTime);
	}
	printf("Inactive domain IDs:\n");
	flags = VIR_CONNECT_LIST_DOMAINS_INACTIVE ;
	virDomainPtr *domains2;
	ret = virConnectListAllDomains(conn, &domains2, flags);
	for (int i=0; i<ret;i++){
		virDomainGetInfo(domains2[i], domainInfo);
		printf("\tid: %d, nom: %s\n",virDomainGetID(domains2[i]), virDomainGetName(domains2[i]));
		printf("\t\tstate: %d\n", domainInfo->state);
        printf("\t\tmaxMem: %lu\n", domainInfo->maxMem);
		printf("\t\tmemory: %lu\n", domainInfo->memory);
		printf("\t\tnrVirtCpu: %d\n", domainInfo->nrVirtCpu);
		printf("\t\tcpuTime: %llu\n", domainInfo->cpuTime);
	}

	/* EXERCICE 5 */
	printf("Shutdown de la VM\n");
	virDomainDestroy(domainToRestart);
	sleep(5);
	printf("Rallumage de la VM\n");
	virDomainCreate(domainToRestart);

	/* EXERCICE 6 */
	printf("Suspend disk\n");
	virDomainSave(domainToRestart, "/var/lib/libvirt/qemu/save/suspend_disk");
	sleep(5);
	virDomainRestore(conn, "/var/lib/libvirt/qemu/save/suspend_disk");
	sleep(5);

	/* EXERCICE 7 */
	printf("Migration");
	virConnectPtr connLocal = virConnectOpenAuth("qemu:///system", virConnectAuthPtrDefault, 0);
	virDomainMigrate3(domainToRestart, connLocal, NULL, 0, VIR_MIGRATE_UNDEFINE_SOURCE);
	virConnectClose(connLocal);

	virConnectClose(conn);
	
	return 0;
}