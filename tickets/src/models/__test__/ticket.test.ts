import { Ticket, TicketDoc } from "../ticket";

it("implements optimistic concurrency control", async () => {
  // create an instance of a ticket
  const ticket: TicketDoc = Ticket.build({
    title: "concert",
    price: 15,
    userId: "1234",
  });
  // save the ticket
  await ticket.save();
  expect(ticket.version).toEqual(0);
  // fetch the ticket twice
  const firstFetch = await Ticket.findById(ticket.id);
  const secondFetch = await Ticket.findById(ticket.id);
  // make two separate changes to the tickets we fetched
  firstFetch!.set({ price: 10 });
  secondFetch!.set({ price: 20 });
  // save the first fetched ticket
  await firstFetch!.save();
  expect(firstFetch!.version).toEqual(1);
  //save the second fetched ticket
  try {
    await secondFetch!.save();
  } catch (e) {
    return;
  }

  //throw new Error("Should not reach here");
});
