const express = require('express');
const router = express.Router();
const PageContent = require('../Models/PageContent');

// GET all pages
router.get('/', async (req, res) => {
  const pages = await PageContent.find();
  res.json(pages);
});

// GET a specific page by key
router.get('/:key', async (req, res) => {
  const page = await PageContent.findOne({ key: req.params.key });
  if (!page) return res.status(404).json({ error: 'Page not found' });
  res.json(page);
});

// POST create a new page
router.post('/', async (req, res) => {
  const { key, title, sections } = req.body;
  const page = new PageContent({ key, title, sections });
  await page.save();
  res.status(201).json(page);
});

// PUT update entire page (title or sections)
router.put('/:key', async (req, res) => {
  const updated = await PageContent.findOneAndUpdate(
    { key: req.params.key },
    { ...req.body, updatedAt: Date.now() },
    { new: true, upsert: false }
  );
  if (!updated) return res.status(404).json({ error: 'Page not found' });
  res.json(updated);
});

// PUT update a specific section inside a page
router.put('/:key/section/:sectionId', async (req, res) => {
  const { title, content } = req.body;
  const page = await PageContent.findOne({ key: req.params.key });
  if (!page) return res.status(404).json({ error: 'Page not found' });

  const section = page.sections.find(s => s.sectionId === req.params.sectionId);
  if (!section) return res.status(404).json({ error: 'Section not found' });

  section.title = title;
  section.content = content;
  page.updatedAt = Date.now();
  await page.save();

  res.json(page);
});

// POST add a new section to a page
router.post('/:key/section', async (req, res) => {
  const { sectionId, title, content } = req.body;
  const page = await PageContent.findOne({ key: req.params.key });
  if (!page) return res.status(404).json({ error: 'Page not found' });

  page.sections.push({ sectionId, title, content });
  page.updatedAt = Date.now();
  await page.save();

  res.json(page);
});

// DELETE a section from a page
router.delete('/:key/section/:sectionId', async (req, res) => {
  const page = await PageContent.findOne({ key: req.params.key });
  if (!page) return res.status(404).json({ error: 'Page not found' });

  page.sections = page.sections.filter(s => s.sectionId !== req.params.sectionId);
  page.updatedAt = Date.now();
  await page.save();

  res.json(page);
});

module.exports = router;
