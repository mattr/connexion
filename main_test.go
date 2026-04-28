package main

import (
	"encoding/json"
	"testing"

	"github.com/mattr/connexion/internal/people"
	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/core"
)

func TestIsMigrateCommand(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		args []string
		want bool
	}{
		{
			name: "serve command",
			args: []string{"connexion", "serve"},
			want: false,
		},
		{
			name: "migrate command",
			args: []string{"connexion", "migrate"},
			want: true,
		},
		{
			name: "migrate subcommand",
			args: []string{"connexion", "migrate", "up"},
			want: true,
		},
		{
			name: "global flag before migrate",
			args: []string{"connexion", "--dir", "/tmp/connexion", "migrate", "down", "1"},
			want: true,
		},
		{
			name: "no command",
			args: []string{"connexion"},
			want: false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()

			got := isMigrateCommand(tt.args)
			if got != tt.want {
				t.Fatalf("isMigrateCommand(%v) = %t, want %t", tt.args, got, tt.want)
			}
		})
	}
}

func TestNewApp(t *testing.T) {
	t.Parallel()

	app := newApp()
	if app == nil {
		t.Fatal("newApp() returned nil")
	}

	if app.RootCmd == nil {
		t.Fatal("newApp() did not initialize RootCmd")
	}

	if _, _, err := app.RootCmd.Find([]string{"migrate"}); err != nil {
		t.Fatalf("newApp() did not register migrate command: %v", err)
	}
}

func TestPersonJSONFieldNames(t *testing.T) {
	t.Parallel()

	person := people.Person{
		ID:       "person-1",
		Name:     "Prince",
		SortName: "Prince",
		Nickname: "The Artist",
	}

	data, err := json.Marshal(person)
	if err != nil {
		t.Fatalf("json.Marshal(Person) returned error: %v", err)
	}

	var got map[string]string
	if err := json.Unmarshal(data, &got); err != nil {
		t.Fatalf("json.Unmarshal(Person) returned error: %v", err)
	}

	want := map[string]string{
		"id":        "person-1",
		"name":      "Prince",
		"sort_name": "Prince",
		"nickname":  "The Artist",
	}

	for key, wantValue := range want {
		if got[key] != wantValue {
			t.Fatalf("Person JSON field %q = %q, want %q", key, got[key], wantValue)
		}
	}
}

func TestPeopleMigration(t *testing.T) {
	t.Parallel()

	app := newAppWithConfig(pocketbase.Config{
		DefaultDataDir: t.TempDir(),
		DefaultDev:     false,
	})
	t.Cleanup(func() {
		if err := app.ResetBootstrapState(); err != nil {
			t.Errorf("ResetBootstrapState() returned error: %v", err)
		}
	})

	if err := app.Bootstrap(); err != nil {
		t.Fatalf("Bootstrap() returned error: %v", err)
	}

	collection, err := app.FindCollectionByNameOrId(people.CollectionName)
	if err != nil {
		t.Fatalf("FindCollectionByNameOrId(%q) returned error: %v", people.CollectionName, err)
	}

	assertTextField(t, collection, people.FieldName, true)
	assertTextField(t, collection, people.FieldSortName, false)
	assertTextField(t, collection, people.FieldNickname, false)
}

func assertTextField(t *testing.T, collection *core.Collection, name string, required bool) {
	t.Helper()

	field, ok := collection.Fields.GetByName(name).(*core.TextField)
	if !ok {
		t.Fatalf("field %q is not a text field", name)
	}

	if field.Required != required {
		t.Fatalf("field %q Required = %t, want %t", name, field.Required, required)
	}

	if field.Max != 255 {
		t.Fatalf("field %q Max = %d, want 255", name, field.Max)
	}
}
