import { User, Thought } from '../models';

export default {

getThought(req, res) {
    Thought.find({})
    .then((thought) => res.json(thought))
    .catch((err) => res.status(400).json(err));
    },

getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
        .select('-__v')
    .then((thought) => 
        !thought 
        ? res.status(404).json({ message: "No thought found with this" })
            : res.json(thought)
        )
        .catch((err) => res.status(400).json(err));
    },

createThought(req, res) {
    Thought.create(req.body)
    .then(({ _id }) => {
        return User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: _id } },
            { new: true }
        );
    })
    .then((thought) => 
        !thought 
        ? res.status(404).json({ message: "No user found with this id!" })
            : res.json(thought)
        )
        .catch((err) => res.json(500).json(err)); 
}, 

updateThought(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId }, 
        { $set: req.body }, 
        { runValidators: true, new: true }
    )
        .then((user) =>
            !user
            ? res.status(404).json({ message: "No thought found with this id!" })
            : res.json(user)
        )
        .catch((err) => res.status(400).json(err));
    }, 

deleteThought(req, res) {
    Thought.findOneAndUpdate({ _id: req.params.thoughtId })
    .then((thought) => 
        !thought
        ? res.status(404).json({ message: "No thought found with this id!" })
        : User.findOneAndUpdate(
            { username: thought.username },
            { $pull: { thoughts: req.params.thoughtId } },
            { new: true }
        )
    )
    .then(() => res.json({ message: 'Thought successfully deleted!' }))
    .catch((err) => res.status(400).json(err));
},

createReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $addToSet: { reactions: req.body } },
        { runValidators: true, new: true }
    )
    .then((thought) => 
        !thought
        ? res.status(404).json({ message: "No thought found with this id!" })
        : res.json(thought)
    )
    .catch((err) => res.status(400).json(err));
}, 

deleteReaction(req, res) {
    Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $pull: { reactions: { reactionId: req.params.reactionId } } },
        { runValidators: true, new: true }
    )
    .then((thought) => 
        !thought
        ? res.status(404).json({ message: "No thought found with this id!" })
        : res.json(thought)
    )
    .catch((err) => res.status(400).json(err));
},
};