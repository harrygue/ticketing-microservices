// write some fake implementation
export const natsWrapper = {
  client: {
    // publish: (subject: string, data: string, callback: () => void) => {
    //   callback();
    // }
     // create a mock
    publish: jest.fn().mockImplementation(
      (subject: string, data: string, callback: () => void) => {
          callback();
      })
  }
}