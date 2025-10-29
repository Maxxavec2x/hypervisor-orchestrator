#include "lib.h"
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>

int getHypervisorConnector(virConnectPtr conn, char* ip){
	char *url = (char*) malloc(sizeof(char) * sizeof(12+strlen(ip)+8));
	strcpy(url, "qemu+ssh://");
	strcat(strcat(url, ip), "/system");
	printf(url);
    conn = virConnectOpenAuth(url, virConnectAuthPtrDefault, 0);
	if (conn == NULL) {
		fprintf(stderr, "Failed to open connection\n");
		return 1;
	}
    return 0;
}



int main(){
	virConnectPtr conn = NULL;
	getHypervisorConnector(conn, "172.19.0.100");
	return 0;
}