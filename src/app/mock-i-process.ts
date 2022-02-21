import { IProcess } from "./IProcess";
// i built it so that it dosent violate the form valdation, since we cannot edit it
export const iProcess: IProcess = {
  superClaim: {
      superClaimNum: 990900900,
      superClaimStatus: { code: 4, value: "טרם התקבלה החלטה" }
  },
  insured: {
      address: {
          cityName: 'Tel aviv',
          streetName: 'Ozar',
      },
      identityType: 7847588,
      age: 27,
      lastName: 'lieber',
      identity: 6538742983,
      firstName: 'mei'
  },
  contactPersons: [{
      id: 456478,
      deliveryFlag: false,
      type: { code: 2, value: 'סוכן' },
      name: 'מאיר',
      phoneNumber: 5678986666,
      email: 'isfr@jhd.cgv',
      address: 'ozar hagonim'
  }],
}
