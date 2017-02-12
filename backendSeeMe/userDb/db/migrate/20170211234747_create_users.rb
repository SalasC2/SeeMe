class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :first_name
      t.string :last_name
      t.string :job
      t.string :email
      t.boolean :discoverable, default: true
      t.string :activeUsers, array: true, default: []

      t.timestamps
    end
  end
end
