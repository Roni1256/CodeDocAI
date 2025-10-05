export const data={
    file1:`#include <stdio.h>

int reverseNum(int N) {
  
  	// Function to store the reversed number
    int rev = 0;
    while (N > 0) {

        // Extract the last digit
        int dig = N % 10;

        // Append the digit to the reversed number
        rev = rev * 10 + dig;

        // Remove the last digit
        N /= 10;
    }
    return rev;
}

int isPalindrome(int N) {
  
    // Negative numbers are not palindromes
    if (N < 0)
        return 0;
    return N == reverseNum(N);
}

int main() {
    int N = 121;
    if (isPalindrome(N)) {
        printf("Yes\n");
    }
    else {
        printf("No\n");
    }
    return 0;
}`,
    file2:`#include <stdio.h>
#include <string.h>

int main() {
    char s[] = "Hello, Geeks!";
  	int pos = 7, l = 5;
  
    // Char array to store the substring
    char ss[20];

    // Extract substring of length 5 and from index 7
  	// using strncpy
    strncpy(ss, s + 7, 5);

  	// Null terminate the substring
    ss[5] = '\0';

    printf("%s", ss);
    return 0;
}`
}