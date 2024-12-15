## Prototype Counter

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

Simple counter app designed to prototype the passage of time, resources, and events for a resource-management-style game. Keep track of your resources with events that modify those resources.

![App preview](https://github.com/Moai-/prototype-counter/blob/master/prototype-counter.png)

## Basic usage example

Run `yarn dev` to launch the project locally, and open [http://localhost:3000](http://localhost:3000) with your browser to see the app.

These instructions simulate smelting 10 iron ore into 5 iron bars.

1. Click "Add Resource" and enter "Iron Ore" for the name. Press "Add" or the Enter key when done to add this resource.
2. Click the gray 0 that appears in the Resources list across from Iron Ore, set it to 10, and press the Enter key.
3. Click "Add Resource" again, and add a new resource called "Iron Bar".
4. Click "Add Event".

- Enter "Smelt Ore into Bar" as Event Name.
- Set the tick counter (to the right of the Event Name input) to 2.
- Press "Add Outcome". Select "Iron Ore" in the first input, "Decrement" in the second, enter 2 as the amount in the third, and "Before" in the fourth.
- Press "Add Outcome" again. Select "Iron Bar" in the first input, "Increment" in the second, leave 1 as the amount in the third, and "After" in the fourth.
- Check the box that says "Repeating".
- Click "Add event" in the modal.

5. Now press the "Next Tick" button twice. The "Smelt Ore into Bar" event will complete, and automatically add a new copy of it to repeat.
6. Pressing the "Next Tick" button 10 times or more will fail this event (as there is no more ore), and prevent it from repeating.
