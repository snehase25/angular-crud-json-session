import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  // membersMock is a object array used for storing members details in json 
  public membersMock: any[] = [];

  constructor(private router: Router) { }

  //#region component hooks
  ngOnInit(): void {

    // Initialize members object data by prefilling with static data or session storage
    this.generateMembersMock();

    // Check for post add or edit functionality call then add or edit the member to membersmock
    if (history.state.navigationId != 1) {
      this.addEditMember();
    }

  }

  // Removes all sessions 
  ngOnDestroy() {
    sessionStorage.removeItem('membersMock');
  }
  //#endregion

  //#region list component functions

  // Initialize membersmock object from mockdata or saved session
  generateMembersMock() {
    let membersMockSession = sessionStorage.getItem('membersMock');
    this.membersMock = (membersMockSession != null && membersMockSession.length > 0) ? JSON.parse(membersMockSession) : this.getMembersMock();
  }

  // Returns the members json object array which is initialized on first time component load
  getMembersMock() {
    let membersMockObject: any[] = [
      { firstname: 'Shailja', lastname: 'Daksha', salary: '1Cr' },
      { firstname: 'Shiv', lastname: 'Shankar', salary: '2Cr' }
    ];
    // Store membermock object array in a session storage
    this.setMembersMockToSession(membersMockObject);
    return membersMockObject;
  }

  // Method stores membersmock object in a session storage
  // Parameter membersMock is an object array
  setMembersMockToSession(membersMock: any) {
    sessionStorage.setItem('membersMock', JSON.stringify(membersMock));
  }

  // Add or Edit Member component calls 
  addEditMember() {
    // Get Member details from Add or Edit page and store in memberInfo variable
    let memberInfo = history.state;
    // Check if call is from "edit" by checking index field
    if (memberInfo.index !== undefined && memberInfo.index != null) // Edit Member
    {
      this.membersMock.forEach(function (element, index) {
        // Check and Find the element to "update" the Member
        if (index == memberInfo.index) {
          element.firstname = memberInfo.member.firstname;
          element.lastname = memberInfo.member.lastname;
          element.salary = memberInfo.member.salary;
        }
      });
    }

    // Check if call is from "add" by checkung index field
    else
      if (memberInfo.index === undefined && memberInfo.firstname !== undefined) // Add Member
      {
        this.membersMock.push(memberInfo);
      }

    // Update membermock object data in a session storage
    this.setMembersMockToSession(this.membersMock);

  }

  //#endregion

  //#region 'click' events
  // "Add Member" button click
  addMember() {
    let member = { firstname: "", lastname: "", salary: "" };
    this.router.navigateByUrl('/add', { state: member }); //OR this.router.navigateByUrl('/add');
  }

  // "Delete" button click
  deleteMember(member: any) {
    if (confirm('Are you sure to delete ?')) {
      this.membersMock.forEach((element, index) => {
        // find the element to be deleted
        if (element === member) {
          this.membersMock.splice(index, 1);
          // Update membermock object data in a session storage
          this.setMembersMockToSession(this.membersMock);
        }
      })
    }
  }
  //#endregion

}
