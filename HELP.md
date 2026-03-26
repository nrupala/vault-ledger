# Help & Troubleshooting

## Common Issues

### Forgotten Password
> [!CAUTION]
> Because Vault Tracker uses zero-knowledge encryption, your password **cannot** be recovered. If you lose it, your data is permanently lost.

### Data Persistence
Data is stored in your browser's IndexedDB. Clearing your browser data/cache will delete your vaults unless you have exported them.

## Support
For technical issues, please refer to the [SUPPORT.md](./SUPPORT.md) file.

### Data Import Formats

Vault Tracker supports importing data in JSON and CSV formats.

#### CSV Format
The first row must be a header. Supported columns:
- **type**: task, note, habit, or expense (defaults to note)
- **title**: The main heading of the item
- **content** or **description**: Detailed text
- **date** or **duedate**: ISO string or numeric timestamp
- **priority**: low, medium, high, critical
- **tags**: Semicolon-separated tags (e.g. "work;urgent")

**Example Tasks CSV:**
```csv
type,title,description,priority,tags
task,Buy Milk,Gallon of organic milk,high,personal;store
task,Code Review,Review UI PR,critical,work
```

#### JSON Format
Must be an array of objects.
```json
[
  {
    "type": "note",
    "payload": { "title": "My Note", "content": "Sample content" },
    "tags": ["sync"]
  }
]
```
