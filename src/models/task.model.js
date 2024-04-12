import { model, Schema } from "mongoose";

const TaskSchema = new Schema({
  name: {
    type: String,
    required: true,
    index: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["Todo", "Progress", "Completed", "Late", "Over-due"],
      message: "{VALUE} is not a valid status",
    },
    default: "Todo",
  },
  dueDate: {
    startDate: {
      type: Date,
      required: false,
      validate: {
        validator: function (dateValue) {
          return !this.parent.endDate || dateValue < this.parent.endDate;
        },
        message: "Start date must be before the end date",
      },
    },
    endDate: {
      type: Date,
      required: false,
      validate: {
        validator: function (dateValue) {
          return !this.parent.startDate || dateValue > this.parent.startDate;
        },
        message: "End date must be after the start date",
      },
    },
  },
  startTime: {
    type: String,
    required: false,
  },
  endTime: {
    type: String,
    required: false,
  },
  duration: {
    type: Number,
    required: false,
  },
  durationType: {
    type: String,
    required: false,
    enum: {
      values: ["Minutes", "Hours", "Days", "Weeks", "Months"],
      message: "{VALUE} is not a valid duration type",
    },
    default: "Hours",
  },
});

const Task = model("Task", TaskSchema);
export default Task;
