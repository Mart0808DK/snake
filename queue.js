class Node {
    constructor(new_data) {
        this.data = new_data;
        this.next = null;
    }
}

 export class Queue {
     constructor() {
         this.head = null;
         this.tail = null;
         this.length = 0;
     }

     
         enqueue(data) {
         const node = new Node(data);

         if (this.tail === null) {
             this.head = this.tail = node;
         } else {
             this.tail.next = node;
             this.tail = node;
         }
         this.length++;
     }

     // head()
     getHead() {
         return this.head;
     }

     // tail()
     getTail() {
         return this.tail;
     }

     // dequeue()
     dequeue() {
         if (this.head === null) return null;
         this.head = this.head.next;
         this.length--;
     }

     // peek()
     peek() {
         return this.head.data;
     }

     // size()
     size() {
         return this.length;
     }

     // get(index)
     get(index) {
         let current = this.head;
         let count = 0;

         while (current) {
             if (count == index) {
                 return current.data;
             }
             count++;
             current = current.next;
         }

         return null;
     }

     dumpList() {
         let current = this.head;
         if (current === null) return console.log("List is empty");
         while (current != null) {
             console.log(current);
             current = current.next;
         }
     }

     clear() {
         this.head = null;
         this.tail = null;
     }
 }


