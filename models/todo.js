// models/todo.js
"use strict";
const { Model, Op } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static async addTask(params) {
      return await Todo.create(params);
    }
    static async showList() {
      console.log("My Todo list \n");

      console.log("Overdue");
      const overdueTodos = await this.overdue();
      const formattedOverdueTodos = overdueTodos
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(formattedOverdueTodos);
      console.log("\n");

      console.log("Due Today");
      const dueTodayTodos = await this.dueToday();
      const formattedDueTodayTodos = dueTodayTodos
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(formattedDueTodayTodos);
      console.log("\n");

      console.log("Due Later");
      const dueLaterTodos = await this.dueLater();
      const formattedDueLaterTodos = dueLaterTodos
        .map((todo) => todo.displayableString())
        .join("\n");
      console.log(formattedDueLaterTodos);
    }

    static async overdue() {
      try {
        let todos = await Todo.findAll({ order: [["id", "ASC"]] });

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        todos = todos.filter((todo) => {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return now.valueOf() > dueDate.valueOf();
        });

        return todos;
      } catch (error) {
        console.error(error);
      }
    }

    static async dueToday() {
      try {
        let todos = await Todo.findAll({ order: [["id", "ASC"]] });

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        todos = todos.filter((todo) => {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return now.valueOf() === dueDate.valueOf();
        });

        return todos;
      } catch (error) {
        console.error(error);
      }
    }

    static async dueLater() {
      try {
        let todos = await Todo.findAll({ order: [["id", "ASC"]] });

        const now = new Date();
        now.setHours(0, 0, 0, 0);

        todos = todos.filter((todo) => {
          const dueDate = new Date(todo.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          return now.valueOf() < dueDate.valueOf();
        });

        return todos;
      } catch (error) {
        console.error(error);
      }
    }

    static async markAsComplete(id) {
      try {
        await Todo.update({ completed: true }, { where: { id: id } });
      } catch (error) {
        console.error(error);
      }
    }

    displayableString() {
      const now = new Date();
      now.setHours(0, 0, 0, 0);
      const dueDate = new Date(this.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      const showDate = now.valueOf() !== dueDate.valueOf();

      let checkbox = this.completed ? "[x]" : "[ ]";
      return `${this.id}. ${checkbox} ${this.title} ${
        showDate ? this.dueDate : ""
      }`.trim();
    }
  }
  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};
