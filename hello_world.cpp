#include <iostream>
// This line includes the input and output of the stream library 
// The <iostream> library is used for input (e.g., std::cin) and output (e.g., std::cout) operations in C++.
// It allows you to use std::cout to print to the console and std::cin to take input from the user.

// must be int main so it can return a val 0 or 1 for success or failure 
// C++ only allows main to have one return type : int 
// this is because main is the entry point of the program, where execution starts
// it's function is to execute a func and then return an integer value of the exist status to the OS
// this is a sig directly to the OS so it won't be seen on my cli 
// to check the exit code on my cli: echo %ERRORLEVEL%

int main() {
    std::cout << "Hello, World!" << std::endl;
    // std::cout = standrd character output - prints text to the console 
    // << = insertion opertor - sends Hello World to std::cout to then be printed out 
    // std:endl - end line - move cursor to next line of console 
    return 0;
    // 0 is returned to OS to show that program has no errors 
}
