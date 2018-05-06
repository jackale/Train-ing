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

#define END_OF_CHAR '\0'

typedef struct
{
	char method[10];
	char *ip;
	char path[256];
	char *accept[256];
	char version[10];
} Request;
typedef struct
{
	char body[256];
	char header[256];
	char content[2084];
} Response;

void getRoute(char *request, char *out);
int getContents(char *path, char *content);
int getImage(char *path, char *content);
int prepareSocket(int port);
void analyzeRequest(char *raw, Request *out);
int buildResponse(char *output, char* path);
void getExtension(char *path, char *out);
void getMIME(char *ext, char *mime);

int main(int argc, char *argv[])
{

	int servSock;					 //server socket descripter
	int clitSock;					 //client socket descripter
	struct sockaddr_in clitSockAddr; //client internet socket address
	unsigned int clitLen;			 // client internet socket address length
	char output[2084];
	char buf[2084];
	char path[256];
	int httpCode = 500;

	// Set Starting Parameters
	int option;
	int port = 0;
	char* documentRoot = NULL;
	Request req;
	int cSize;

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

		sprintf(path, "%s%s", documentRoot, req.path);

		cSize = buildResponse(output, path);

		// send(clitSock, "Hello World\n", strlen("Hello World\n"), 0);
		send(clitSock, output, cSize, 0);

		// printf("connected from %s.\n", inet_ntoa(clitSockAddr.sin_addr));
		printf("[%s] %s [%d]: %s\n", "WIP:Time will inserted here", inet_ntoa(clitSockAddr.sin_addr), httpCode, req.path);
		close(clitSock);
	}

	return EXIT_SUCCESS;
}

/**
 * Socketの準備
 * @param int port ポート番号
 * @return int socket ソケット
 */
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

/**
 * パスからファイル内容を取得
 * @param char* path パス
 * @param char* content 出力用
 * @return int 読み込んだサイズ
 */

int getContents(char* path, char* content) {
	FILE* fp;
	char buf[256];
	int bufsize = 256;
	int readSize = 0;
	if ((fp = fopen(path, "r")) != NULL) {
		sprintf(content, "");
		while(fgets(buf, bufsize, fp) != NULL) {
			sprintf(content, "%s%s\r\n", content, buf);
			readSize += bufsize;
		}
	}

	fclose(fp);
	return readSize;
}

/**
 * パスから画像を取得
 * @param char* path パス
 * @param char* content 出力用
 * @return int 読み込んだサイズ
 */
int getImage(char* path, char* content) {
	FILE* fp;
	char buf[1024];
	int bufsize = 1024;
	int readSize = 0, size;
	int i = 0, j;
	if ((fp = fopen(path, "r")) != NULL) {
		while ((size = fread(buf, sizeof(unsigned char), 1024, fp))) {
			for (j = 0; j < size; j++) {
				content[i++] = buf[j];
			}
			printf("\n");
			readSize += size;
		}
	}
	fclose(fp);
	return readSize;
}

/**
 * 受け取ったraw文字列からRequest構造体へパース
 * @param char* raw raw文字列
 * @param Request* out 出力用
 */
void analyzeRequest(char *raw, Request *out) {
	const char *delimiter = "\r\n";
	char *line;
	char field[2048], content[2048], work[ACCEPT_HEADER_LENGTH];

	// Backup
	strncpy(work, raw, strlen(raw) + 1);

	// Process Request Line
	line = strtok(work, delimiter);
	sscanf(line, "%s %s %s", out->method, out->path, out->version);

	// Process Header Field (if you have to get)
	// while(1) {
	// 	line = strtok(NULL, delimiter);
	// 	if (line == NULL) {
	// 		break;
	// 	}
	// 	sscanf(line, "%[^:]%*c %s", field, content);
	// }
}

/**
 * レスポンスを構築
 * @param char* output 出力用
 * @param char* path 開くファイルパス
 * @return int 読み込んだファイルサイズ
 */
int buildResponse(char *output, char *path) {
	char extension[10], mime[64];
	char content[2084];
	char *template = "HTTP/1.0 200 OK\r\nContent-Length: %d\r\nContent-Type: %s\r\n\r\n";//%s\r\n";
	int result, len, i = 0, j = 0;
	int size;
	getExtension(path, extension);
	getMIME(extension, mime);

	if (strstr(mime, "image") != NULL) {
		result = getImage(path, content);
		len = result;
	} else {
		result = getContents(path, content);
		len = strlen(content);
	}

	if (result == 0) {
		strcpy(content, "Not found.\n");
		strcpy(mime, "text/plain");
		len = strlen(content);
	}
	sprintf(output, template, len, mime);
	size = strlen(output);
	memcpy(output+strlen(output), content, len);
	// output[i] = '\0';
	// strcat(output, content);
	return len + size;
}

/**
 * パスから拡張子を取得
 * @param char* path パス
 * @param char* out 出力用
 */
void getExtension(char *path, char *out) {
	int i = 0, j = 0;
	while (path[i] != '.' && path[i] != END_OF_CHAR) {
		i++;
	}
	if (path[i] == END_OF_CHAR) return;
	i++;
	while (path[i] != END_OF_CHAR) {
		out[j++] = path[i++];
	}
	out[j] = END_OF_CHAR;
}

/**
 * 拡張子からMIMEタイプを判定し取得
 * @param char* ext 拡張子
 * @param char* mime 出力用
 */
void getMIME(char *ext, char *mime) {
	if (strcmp(ext, "html") == 0) {
		strcpy(mime, "text/html");
	}
	else if (strcmp(ext, "css") == 0) {
		strcpy(mime, "text/css");
	}
	else if (strcmp(ext, "js") == 0) {
		strcpy(mime, "text/javascript");
	}
	else if (strcmp(ext, "gif") == 0) {
		strcpy(mime, "image/gif");
	}
	else if (strcmp(ext, "png") == 0) {
		strcpy(mime, "image/png");
	}
	else if (strcmp(ext, "jpg") == 0 || strcmp(ext, "jpeg") == 0) {
		strcpy(mime, "image/jpeg");
	}
	else {
		strcpy(mime, "text/plain");
	}
}