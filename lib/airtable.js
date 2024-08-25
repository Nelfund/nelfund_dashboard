const Airtable = require("airtable");

const base = new Airtable({
  apiKey:
    "patFc8UQhpuvdfGfD.e716793c3a499c31e6a12448e214c1b49c785487855314a792416fefe0e653cd",
}).base("appJ1OADLrMNCQqE0");

export const fetchRecords = async () => {
  const records = await base("results").select().all();
  return records.map((record) => ({
    id: record.id,
    name: record.get("name"),
    email: record.get("email"),
    location: record.get("location"),
    number: record.get("number"),
    institution: record.get("institution"),
    others: record.get("others"),
    course: record.get("course"),
    level: record.get("level"),
    matric: record.get("matric"),
    jamb: record.get("jamb"),
  }));
};
