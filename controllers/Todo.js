const Todo = require("../model/Todo");

exports.createTodo = async (req, res) => {
  if (req.session.is_logged_in) {
    try {
      const { todoName } = req.body;
      console.log(todoName);

      if (!todoName) {
        return res.status(400).json({
          success: false,
          message: "Please provide todo",
        });
      }

      const todo = await Todo.create({
        email:req.session.email,
        todoName,
      });

      return res.status(200).json({
        success: true,
        message: "todo created successfully",
        todo,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "internal server error. Plesae try again",
      });
    }
  } else {
    return res.redirect("/login");
  }
};
exports.updateTodo = async (req, res) => {
    if(req.session.is_logged_in)
    {
        try {
            const { id, todoName } = req.body;
        
            const updatedTodo = await Todo.findByIdAndUpdate(
              id,
              { todoName },
              { new: true }
            );
        
            if (!updatedTodo) {
              return res.status(400).json({
                success: false,
                message: "todo not found",
              });
            }
        
            return res.status(200).json({
              success: true,
              message: "todo updated successfully",
            });
        } catch (error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "internal server error. Plesae try again",
          });
        }
    }
    else{
        return res.redirect("/login");
    }
 
};

exports.checkTodo = async (req, res) => {
    if(req.session.is_logged_in)
    {
        try {
            const { id, checked } = req.body;
        
            const updatedTodo = await Todo.findByIdAndUpdate(
              id,
              { checked },
              { new: true }
            );
        
            if (!updatedTodo) {
              return res.status(400).json({
                success: false,
                message: "todo not found",
              });
            }
        
            return res.status(200).json({
              success: true,
              message: "todo updated successfully",
            });
          } catch (error) {
            console.log(error);
            return res.status(500).json({
              success: false,
              message: "internal server error. Plesae try again",
            });
          }
    }
    else{
        return res.redirect("/login")
    }
};

exports.deleteTodo = async (req, res) => {
    if(req.session.is_logged_in)
        {
            try {
                const { id } = req.body;
            
                const updatedTodo = await Todo.findByIdAndUpdate(
                  id,
                  { isDeleted:true },
                  { new: true }
                );
            
                if (!updatedTodo) {
                  return res.status(400).json({
                    success: false,
                    message: "todo not found",
                  });
                }
            
                return res.status(200).json({
                  success: true,
                  message: "todo updated successfully",
                });
              } catch (error) {
                console.log(error);
                return res.status(500).json({
                  success: false,
                  message: "internal server error. Plesae try again",
                });
              }
        }
        else{
            return res.redirect("/login")
        }
};

exports.getTodo = async (req, res) => {
    if (req.session.is_logged_in) {
        try {
          const data = await Todo.find({ email: req.session.email });
          return res.status(200).json(data);
        } catch (err) {
          console.error(err);
          res.status(500).json("Error while fetching todo.");
        }
    } else {
      return res.redirect("/login");
    }
};
