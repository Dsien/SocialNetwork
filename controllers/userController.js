import { User, Thought } from '../models';

export default {
    getUser(_, res) {
        User.find({})
        .then((user) => res.json(user))
        .catch((err) => res.status(400).json(err));
    },

    getSingleUser(req, res) {
        User.findOne({ _id: req.params.id })
        .populate("thoughts")
        .populate("friends")
        .select("-__v")
        .then((user) => 
            !user
            ? res.status(404).json({ message: "No user found with this id!" })
            : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    },

    createUser(req, res) {
        User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => {
            console.log(err);
            res.status(400).json(err);
        });
    },

    updateUser(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.id },
            { $set: req.body },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: "No user found with this id!" })
            : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    },

    deleteUser(req, res) {
        User.findOneAndDelete({ _id: req.params.id })
        .then((user) =>
            !user
            ? res.status(404).json({ message: "No user found with this id!" })
            : Thought.deleteMany({ _id: { $in: user.thoughts } })
        )
        .then(() => res.json({ message: "User and User's thoughts deleted!" }))
        .catch((err) => res.status(400).json(err));
    },

    addFriend(req, res) {
        User.findOneAndUpdate(
            {_id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { runValidators: true, new: true }
        )
        .then((user) =>
            !user
            ? res.status(404).json({ message: "No user found with this id!" })
            : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    }, 

    deleteFriend(req, res) {
        User.findOneAndUpdate(
            { _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true }
        )
        .then(
            (user) =>
            !user
            ? res.status(404).json({ message: "No user found with this id!" })
            : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    },
};