"""

So, let me explain this so quick.
each spot in the binary will be a permission
in example, 0001 (1) will be a permission
0010 (2), 0100 (4), etc..

so, if we want to give a user a permission, we can do it by adding the permission to the user's permissions
we can do this by using the | operator. for example:

"1 | 2 | 4" will be "0001 | 0010 | 0100" which is 7 (0111)
i saw someone is using this and i was kinda curious so i wanted to ship it in this project ig

btw this is more efficient than using a list of permissions, or any other method i can think of

"""

def make_permission(number: int) -> int:
    return 1 << number

def has_permission(permissions: int, permission: int) -> bool:
    return permissions & permission == permission

def add_permission(permissions: int, permission: int) -> int:
    return permissions | permission

def remove_permission(permissions: int, permission: int) -> int:
    return permissions & ~permission
