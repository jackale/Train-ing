#include <stdio.h>		//printf(), fprintf(), perror()
#include <sys/socket.h> //socket(), bind(), accept(), listen()
#include <arpa/inet.h>  // struct sockaddr_in, struct sockaddr, inet_ntoa()
#include <stdlib.h>		//atoi(), exit(), EXIT_FAILURE, EXIT_SUCCESS
#include <string.h>		//memset()
#include <unistd.h>		//close()

#define QUEUELIMIT 5

int main(int argc, char *argv[])
{

	int servSock;					 //server socket descripter
	int clitSock;					 //client socket descripter
	struct sockaddr_in servSockAddr; //server internet socket address
	struct sockaddr_in clitSockAddr; //client internet socket address
	unsigned short servPort;		 //server port number
	unsigned int clitLen;			 // client internet socket address length
	unsigned int sockFlag = 1;
	char buf[2084];
	char *body = "<!DOCTYPE html>\r\n <html>\r\n <head>\r\n <title>テストページ</title>\r\n </head>\r\n <body>\r\n Hello World\r\n </body>\r\n </html>\r\n";
	char inbuf[2084];

	if (argc != 2)
	{
		fprintf(stderr, "argument count mismatch error.\n");
		exit(EXIT_FAILURE);
	}

	if ((servPort = (unsigned short)atoi(argv[1])) == 0)
	{
		fprintf(stderr, "invalid port number.\n");
		exit(EXIT_FAILURE);
	}

	if ((servSock = socket(PF_INET, SOCK_STREAM, IPPROTO_TCP)) < 0)
	{
		perror("socket() failed.");
		exit(EXIT_FAILURE);
	}

	memset(&servSockAddr, 0, sizeof(servSockAddr));
	servSockAddr.sin_family = AF_INET;
	servSockAddr.sin_addr.s_addr = htonl(INADDR_ANY);
	servSockAddr.sin_port = htons(servPort);

	setsockopt(servSock, SOL_SOCKET, SO_REUSEADDR, (const int *)&sockFlag, sizeof(sockFlag));

	sprintf(buf, "HTTP/1.0 200 OK\r\nContent-Length: %d\r\nContent-Type: text/html\r\n\r\n%s\r\n", (int)strlen(body), body);

	// memset(buf, 0, sizeof(buf));
	printf("buf: %s\n", buf);

	if (bind(servSock, (struct sockaddr *)&servSockAddr, sizeof(servSockAddr)) < 0)
	{
		perror("bind() failed.");
		exit(EXIT_FAILURE);
	}

	if (listen(servSock, QUEUELIMIT) < 0)
	{
		perror("listen() failed.");
		exit(EXIT_FAILURE);
	}

	while (1)
	{
		clitLen = sizeof(clitSockAddr);
		if ((clitSock = accept(servSock, (struct sockaddr *)&clitSockAddr, &clitLen)) < 0)
		{
			perror("accept() failed.");
			exit(EXIT_FAILURE);
		}

		memset(inbuf, 0, sizeof(inbuf));
		recv(clitSock, inbuf, sizeof(inbuf), 0);
		// 本来ならばクライアントからの要求内容をパースすべきです
		printf("%s\n", inbuf);

		// send(clitSock, "Hello World\n", strlen("Hello World\n"), 0);
		send(clitSock, buf, (int)strlen(buf), 0);


		printf("connected from %s.\n", inet_ntoa(clitSockAddr.sin_addr));
		close(clitSock);
	}

	return EXIT_SUCCESS;
}