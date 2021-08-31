import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

import { User } from 'src/app/models/user/user.model'
import { UsersService } from 'src/app/services/users/users.service'
import { AuthService } from 'src/app/services/auth/auth.service'
import { AddMemberDialogComponent } from '../add-member-dialog/add-member-dialog.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: Array<User> = []
  displayedColumns: string[] = ['name', 'email', 'state']
  showAddMemberButton = false

  @ViewChild(MatTable) usersTable!: MatTable<User>;

  constructor(
    private userService: UsersService,
    private authService: AuthService,
    public dialog: MatDialog
  ) {
    if (authService.isAdmin()) {
      this.displayedColumns.push('actions')
      this.showAddMemberButton = true
    }
  }

  ngOnInit(): void {
    this.userService.getAllUsers().subscribe(response => {
      this.users = response.users
    })
  }

  openAddMemberDialog() {
    const dialogRef = this.dialog.open(AddMemberDialogComponent, {
      width: '50vw',
      data: {
        name: '',
        lastname: '',
        email: '',
        password: '',
        isAdmin: false,
      }
    })

    dialogRef.afterClosed().subscribe(userData => {
      if (userData) {
        this.userService.createUser(userData).subscribe(response => {
          this.users.push(response.user)
          this.usersTable.renderRows()
        })
      }
    })
  }

  changeUserState(userId: string, userState: boolean) {
    const userData = {
      isBanned: !userState
    }

    this.userService.editUser(userId, userData).subscribe(response => {
      this.users = this.users.map(user => {
        if (user._id == userId) {
          return response.user
        }
        return user
      })
      this.usersTable.renderRows()
    })
  }

}
