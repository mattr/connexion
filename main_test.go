package main

import "testing"

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
