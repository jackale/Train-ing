#include <stdio.h>

void func(void);

int main(int argc, char const *argv[]) {
  int buf[1000];
  func();
  return 0;
}

void hello(void) {
  fprintf(stderr, "hello!\n");
}

void func(void) {
  void (*buf[10])(void);
  static int i;

  for (i = 0; i < 30; i++) {
    buf[i] = hello;
  }
}