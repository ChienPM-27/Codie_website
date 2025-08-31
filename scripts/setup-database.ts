import { createClient } from "@supabase/supabase-js"
import fs from "fs"
import path from "path"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function runSQLFile(filename: string) {
  console.log(`Running ${filename}...`)

  const filePath = path.join(process.cwd(), "scripts", filename)
  const sql = fs.readFileSync(filePath, "utf8")

  const { error } = await supabase.rpc("exec_sql", { sql_query: sql })

  if (error) {
    console.error(`Error running ${filename}:`, error)
    throw error
  }

  console.log(`✅ ${filename} completed`)
}

async function setupDatabase() {
  try {
    const files = ["001_create_schema.sql", "002_create_functions.sql", "003_enable_rls.sql", "004_seed_data.sql"]

    for (const file of files) {
      await runSQLFile(file)
    }

    console.log("🎉 Database setup completed!")
  } catch (error) {
    console.error("Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
