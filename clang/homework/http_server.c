#include <stdio.h>		//printf(), fprintf(), perror()
#include <sys/socket.h> //socket(), bind(), accept(), listen()
#include <arpa/inet.h>  // struct sockaddr_in, struct sockaddr, inet_ntoa()
#include <stdlib.h>		//atoi(), exit(), EXIT_FAILURE, EXIT_SUCCESS
#include <string.h>		//memset()
#include <unistd.h>		//close()

#define QUEUELIMIT 5

#define DEFAULT_PORT 8080
// #define DOCUMENT_ROOT "/Users/s01715/kenshu/Train-ing/clang/homework/html"
#define DOCUMENT_ROOT "/Users/kazutaka/work/Train-ing/clang/homework/html"
#define ACCEPT_HEADER_LENGTH 2048

typedef struct
{
	char method[10];
	char *ip;
	char path[256];
	char *accept[256];
	char version[10];
} Request;

void buildHtml(char* out, char* body);
void getRoute(char *request, char *out);
int getContents(char *path, char *content);
int prepareSocket(int port);
void analyzeRequest(char *raw, Request *out);


int main(int argc, char *argv[])
{

	int servSock;					 //server socket descripter
	int clitSock;					 //client socket descripter
	struct sockaddr_in servSockAddr; //server internet socket address
	struct sockaddr_in clitSockAddr; //client internet socket address
	unsigned short servPort;		 //server port number
	unsigned int clitLen;			 // client internet socket address length
	unsigned int sockFlag = 1;
	char output[2084];
	char *body = "<!DOCTYPE html>\r\n <html lang=\"ja\">\r\n <head>\r\n <meta http-equiv=\"content-type\" charset=\"utf-8\"><title>Test Page</title>\r\n </head>\r\n <body>\r\nHello World\r\n</body>\r\n</html>\r\n";
	char buf[2084];
	char path[256];
	char _path[256];
	int httpCode = 500;

	// Set Starting Parameters
	int option;
	int port = 0;
	char* documentRoot = NULL;
	Request req;

	while((option = getopt(argc, argv, "p:d:")) != -1) {
		if (option == '?') {
			fprintf(stderr, "Unknown Option. -%c", option);
			exit(EXIT_FAILURE);
		}
		else if (option == 'p') {
			port = atoi(optarg);
		}
		else if (option == 'd') {
			documentRoot = optarg;
		}
	}

	if (port == 0) {
		port = (getenv("DEFAULT_PORT") != NULL) ? atoi(getenv("DEFAULT_PORT")) : DEFAULT_PORT;
		if (port == 0) {
			fprintf(stderr, "invalid port number.\n");
			exit(EXIT_FAILURE);
		}
	}
	if (documentRoot == NULL) {
		documentRoot = (getenv("DOCUMENT_ROOT") != NULL) ? getenv("DOCUMENT_ROOT") : DOCUMENT_ROOT;
	}

	if ((servSock = prepareSocket(port)) < 0) {
		fprintf(stderr, "Failed preparing socket...");
		exit(EXIT_FAILURE);
	}

	// Waitng for Access ...
	printf("Listening to PORT:%d\nNOTICE: DOCUMENT_ROOT is %s\n", port, documentRoot);
	while (1)
	{
		clitLen = sizeof(clitSockAddr);
		if ((clitSock = accept(servSock, (struct sockaddr *)&clitSockAddr, &clitLen)) < 0)
		{
			perror("accept() failed.");
			exit(EXIT_FAILURE);
		}

		memset(buf, 0, sizeof(buf));
		recv(clitSock, buf, sizeof(buf), 0);

		analyzeRequest(buf, &req);

		// printf("%s\n", buf);
		sprintf(path, "%s%s", documentRoot, req.path);

		char content[2084];
		if (getContents(path, content) == 0) {
			sprintf(content, "Not Found\r\n");
			httpCode = 404;
		} else {
			httpCode = 200;
		}

		buildHtml(output, content);

		// send(clitSock, "Hello World\n", strlen("Hello World\n"), 0);
		send(clitSock, output, (int)strlen(output), 0);

		// printf("connected from %s.\n", inet_ntoa(clitSockAddr.sin_addr));
		printf("[%s] %s:57043 [%d]: %s\n", "WIP:Time will inserted here", inet_ntoa(clitSockAddr.sin_addr), httpCode, req.path);
		close(clitSock);
	}

	return EXIT_SUCCESS;
}

int prepareSocket(int port) {
	int _socket;
	unsigned int sockFlag = 1;
	struct sockaddr_in socketAddr; //server internet socket address

	if ((_socket = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0)
		return -1;

	memset(&socketAddr, 0, sizeof(socketAddr));
	socketAddr.sin_family = AF_INET;
	socketAddr.sin_addr.s_addr = htonl(INADDR_ANY);
	socketAddr.sin_port = htons(port);

	setsockopt(_socket, SOL_SOCKET, SO_REUSEADDR, (const int *)&sockFlag, sizeof(sockFlag));

	if (bind(_socket, (struct sockaddr *)&socketAddr, sizeof(socketAddr)) < 0)
		return -1;

	if (listen(_socket, QUEUELIMIT) < 0)
		return -1;

	return _socket;
}

void buildHtml (char* out, char* body) {
	// char htmlTemplate[256] = "HTTP/1.0 200 OK\r\nContent-Length: %d\r\nContent-Type: text/html\r\n\r\n%s\r\n";
	char htmlTemplate[256] = "HTTP/1.0 200 OK\r\nContent-Length: %d\r\nContent-Type: text/html\r\n\r\n%s\r\n";
	sprintf(out, htmlTemplate, (int)strlen(body), body);
}

int getContents(char* path, char* content) {
	FILE* fp;
	char buf[256];
	int bufsize = 256;
	int readSize = 0;
	sprintf(content, "");
	if ((fp = fopen(path, "r")) != NULL) {
		while(fgets(buf, bufsize, fp) != NULL) {
			sprintf(content, "%s%s\r\n", content, buf);
			readSize += bufsize;
		}
	}

	fclose(fp);
	return readSize;
}

void analyzeRequest(char *raw, Request *out) {
	const char *delimiter = "\r\n";
	char *line;
	char field[2048], content[2048], work[ACCEPT_HEADER_LENGTH];

	// Backup
	strncpy(work, raw, strlen(raw) + 1);

	// Process Request Line
	line = strtok(work, delimiter);
	sscanf(line, "%s %s %s", out->method, out->path, out->version);

	// Process Header Field
	while(1) {
		line = strtok(NULL, delimiter);
		if (line == NULL) {
			break;
		}
		sscanf(line, "%[^:]%*c %s", field, content);
		printf("%s : %s\n", field, content);
	}
}