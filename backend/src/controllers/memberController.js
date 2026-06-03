const Member = require('../models/Member');

const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().sort({ name: 1 });
    res.status(200).json(members);
  } catch (error) { res.status(500).json({ error: error.message }); }
};

const createMember = async (req, res) => {
  try {
    const newMember = new Member(req.body);
    const savedMember = await newMember.save();
    res.status(201).json(savedMember);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedMember);
  } catch (error) { res.status(400).json({ error: error.message }); }
};

const deleteMember = async (req, res) => {
  try {
    await Member.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ error: error.message }); }
};

module.exports = { getAllMembers, createMember, updateMember, deleteMember };