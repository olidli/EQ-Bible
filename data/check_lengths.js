const data = require('./knowledge_structured.js');
const articles = data.slice(0, 5);
articles.forEach(a => {
  const chSummaries = a.content.key_chapters.map(c => c.summary).join('');
  const tips = a.content.practical_tips.join('');
  const total = (a.description || '') + (a.content.summary || '') + chSummaries + tips;
  console.log('ID:', a.id, '|', a.t);
  a.content.key_chapters.forEach(c => {
    console.log('  chapter:', c.chapter.slice(0,15), '| summary长度:', c.summary.length, '字');
  });
  console.log('  文章总字数(估算):', total.length, '字');
  console.log('');
});
