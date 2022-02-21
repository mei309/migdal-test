export interface IProcess {
  superClaim: {
      superClaimNum: number;
      superClaimStatus: {
          code: number;
          value: string;
      };
  };
  insured: {
      address: {
          cityName: string;
          streetName: string;
      };
      identityType: number;
      age: number;
      lastName: string;
      identity: number;
      firstName: string;
  };
  contactPersons: [{
      id: number;
      deliveryFlag: boolean;
      type: {
          code: number;
          value: string;
      }
      name: string;
      phoneNumber: number;
      email: string;
      address: string;
  }];
}
