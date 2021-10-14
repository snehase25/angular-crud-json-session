import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public membersMock: any[] = []; // membersMock is a object array used for storing members details in json 
  public displayMessage: string = ""; // Success messages 
  private readonly lastPage = sessionStorage.getItem('page'); // get last page name from session

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Initialize members object data by prefilling with static data or session storage
    this.generateMembersMock();

    // Check for post add or edit functionality call then add or edit the member to membersmock
    if (this.lastPage == 'add' || this.lastPage == 'edit') {
      this.addEditMember();
    }

  }

  // "Add Member" button click
  public addMember(): void {
    this.router.navigate(['/add']); //OR this.router.navigateByUrl('/add');
  }

  // "Delete" button click
  public deleteMember(member: any): void {
    if (confirm('Are you sure to delete ?')) {
      try {
        this.membersMock.forEach((element, index) => {
          // find the element to be deleted
          if (element === member) {
            this.membersMock.splice(index, 1);
            // Update membermock object data in a session storage
            this.setMembersMockToSession(this.membersMock);
          }
        });
        // Display message on page
        this.displayMessage = "Member deleted successfully!"
      }
      catch (e) { console.log(e); }
    }
  }

  // Initialize membersmock object from mockdata or saved session
  private generateMembersMock(): void {
    let membersMockSession = sessionStorage.getItem('membersMock');
    this.membersMock = (membersMockSession != null && membersMockSession.length > 0) ? JSON.parse(membersMockSession) : this.getMembersMock();
  }

  // Returns the members json object array which is initialized on first time component load
  private getMembersMock(): any {
    let membersMockObject: any[] = [
      { firstname: 'Shailja', lastname: 'Daksha', salary: '1Cr' },
      { firstname: 'Shiv', lastname: 'Shankar', salary: '2Cr' }
    ];
    // Store membermock object array in a session storage
    this.setMembersMockToSession(membersMockObject);
    return membersMockObject;
  }

  // Method stores membersmock object in a session storage
  private setMembersMockToSession(membersMock: any): void {
    sessionStorage.setItem('membersMock', JSON.stringify(membersMock));
  }

  // Add or Edit Member component calls 
  private addEditMember(): void {
    // Get Member details from Add or Edit page and store in memberInfo variable
    let memberInfo = history.state;
    // Add Member
    if (this.lastPage == "add") {
      try {
        this.membersMock.push(memberInfo);
        // Display message on page
        this.displayMessage = "Member added successfully!"
      }
      catch (e) { console.log(e); }
    }
    // Edit Member
    if (this.lastPage == "edit") {
      try {
        this.membersMock.forEach(function (element, index) {

          // Check and Find the element to "update" the Member
          if (index == memberInfo.index) {
            element.firstname = memberInfo.member.firstname;
            element.lastname = memberInfo.member.lastname;
            element.salary = memberInfo.member.salary;
          }
        });
        // Display message on page
        this.displayMessage = "Member updated successfully!"
      }
      catch (e) { console.log(e); }
    }

    // Update membermock object data in a session storage
    this.setMembersMockToSession(this.membersMock);

  }
}
